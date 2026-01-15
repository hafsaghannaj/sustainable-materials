#!/bin/bash
# setup.sh

echo "Setting up Bend the emissions curve of the built environment..."

# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create data directories
mkdir -p data/ml_models data/ecoinvent data/uploads

# Initialize database (if using SQLAlchemy)
# python -c "from core.database import init_db; init_db()"

echo "Installation complete!"
echo ""
echo "To start the API server:"
echo "  source venv/bin/activate"
echo "  python -m uvicorn api.endpoints:app --reload"
echo ""
echo "Or with Docker:"
echo "  docker-compose up --build"
