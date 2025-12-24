#!/bin/bash
# Bash Script: Organize Template into Folder
# Usage: ./organize-template.sh template.zip template-name

TEMPLATE_ZIP="$1"
TEMPLATE_NAME="$2"
DESTINATION="${3:-$HOME/My Drive/Templates}"

# Create destination folder if it doesn't exist
mkdir -p "$DESTINATION"

# Create template folder
TEMPLATE_FOLDER="$DESTINATION/$TEMPLATE_NAME"

if [ -d "$TEMPLATE_FOLDER" ]; then
    echo "Template folder already exists: $TEMPLATE_FOLDER"
    read -p "Do you want to overwrite? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Cancelled."
        exit 1
    fi
    rm -rf "$TEMPLATE_FOLDER"
fi

echo "Creating template folder: $TEMPLATE_FOLDER"
mkdir -p "$TEMPLATE_FOLDER"

# Extract ZIP file
if [ ! -f "$TEMPLATE_ZIP" ]; then
    echo "Error: ZIP file not found: $TEMPLATE_ZIP"
    exit 1
fi

echo "Extracting template..."
unzip -q "$TEMPLATE_ZIP" -d "$TEMPLATE_FOLDER"

# Get extracted folder (might be nested)
EXTRACTED_FOLDERS=$(find "$TEMPLATE_FOLDER" -mindepth 1 -maxdepth 1 -type d)
if [ $(echo "$EXTRACTED_FOLDERS" | wc -l) -eq 1 ]; then
    echo "Moving files from nested folder..."
    mv "$EXTRACTED_FOLDERS"/* "$TEMPLATE_FOLDER"/
    rmdir "$EXTRACTED_FOLDERS"
fi

# Create README
cat > "$TEMPLATE_FOLDER/README.md" << EOF
# $TEMPLATE_NAME

Template downloaded from AZone Store.

## Setup

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Run development server:
\`\`\`bash
npm run dev
\`\`\`

## Notes

- Downloaded: $(date '+%Y-%m-%d %H:%M:%S')
- Source: AZone Store
EOF

echo ""
echo "Template organized successfully!"
echo "Location: $TEMPLATE_FOLDER"
echo ""
echo "Next steps:"
echo "1. Open folder in VS Code"
echo "2. Run: npm install"
echo "3. Run: npm run dev"

