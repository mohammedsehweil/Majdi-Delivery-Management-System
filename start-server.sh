#!/bin/bash
# Simple local web server starter
# This will serve your files at http://localhost:8000

echo "🚀 Starting local web server..."
echo "📂 Serving files from: $(pwd)"
echo ""
echo "🌐 Open your browser and go to:"
echo "   http://localhost:8000/add-shipping-certificate.html"
echo ""
echo "Press Ctrl+C to stop the server"
echo "================================"
echo ""

# Check if Python 3 is available
if command -v python3 &> /dev/null; then
    python3 -m http.server 8000
# Fallback to Python 2
elif command -v python &> /dev/null; then
    python -m SimpleHTTPServer 8000
else
    echo "❌ Error: Python is not installed"
    echo "Please install Python or use another method"
fi

