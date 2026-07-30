FROM python:3.10-slim

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY . /code

# Hugging Face Spaces default port 7860 use karta hai
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]