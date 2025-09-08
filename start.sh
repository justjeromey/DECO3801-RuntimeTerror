#!/bin/bash

# Rolling Hills - Start Script
# This script starts both the backend (FastAPI) and frontend (Next.js) servers

echo "Starting Rolling Hills application..."
echo "=================================="

# Check if virtual environment exists
if [ ! -d ".venv" ]; then
    echo "Error: Virtual environment not found. Please run the installation first."
    echo "Run: npm run install-all (from trailrunners directory)"
    exit 1
fi

# Check if backend dependencies are installed
if [ ! -f "backend/requirements.txt" ]; then
    echo "Error: Backend requirements.txt not found."
    exit 1
fi

# Check if frontend dependencies are installed
if [ ! -d "trailrunners/node_modules" ]; then
    echo "Error: Frontend node_modules not found. Please install frontend dependencies first."
    echo "Run: cd trailrunners && npm install"
    exit 1
fi

echo "Starting backend server (FastAPI) on http://127.0.0.1:8000..."
echo "Starting frontend server (Next.js) on http://localhost:3000..."
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Function to cleanup background processes
cleanup() {
    echo ""
    echo "Stopping servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    wait $BACKEND_PID $FRONTEND_PID 2>/dev/null
    echo "Servers stopped."
    exit 0
}

# Set up trap to cleanup on Ctrl+C
trap cleanup SIGINT SIGTERM

# Start backend server in background
cd backend
echo "Activating Python virtual environment and starting FastAPI server..."
(
    # Activate virtual environment and start FastAPI
    source ../.venv/Scripts/activate
    uvicorn main:app --reload --host 127.0.0.1 --port 8000
) &
BACKEND_PID=$!
cd ..

# Give backend a moment to start
sleep 3

# Start frontend server in background
cd trailrunners
echo "Starting Next.js development server..."
npm run dev &
FRONTEND_PID=$!
cd ..

# Wait for both processes
echo ""
echo "✓ Backend server started (PID: $BACKEND_PID)"
echo "✓ Frontend server started (PID: $FRONTEND_PID)"
echo ""
echo "Both servers are now running:"
echo "  - Backend API: http://127.0.0.1:8000"
echo "  - Frontend App: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for both background processes
wait $BACKEND_PID $FRONTEND_PID
