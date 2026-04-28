#!/bin/bash
# This script starts your Python backend so it is accessible to the Android Emulator.
echo "Starting FastAPI Backend for Android Emulator..."
echo "Binding to 0.0.0.0 so the emulator can reach it!"
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
