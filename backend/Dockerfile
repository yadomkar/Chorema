# Use an official Python runtime as the base image
FROM python:3.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends libpq-dev gcc \
    && apt-get clean

# Install Python dependencies
COPY requirements.txt /requirements.txt
RUN pip install --no-cache-dir -r /requirements.txt

# Set the working directory inside the container
WORKDIR /app

# Copy the current directory contents into the container at /app/
COPY . /app/

#VOLUME /app/static

# Command to run on container start
CMD ["gunicorn", "chorema.wsgi:application", "--bind", "0.0.0.0:8000"]
