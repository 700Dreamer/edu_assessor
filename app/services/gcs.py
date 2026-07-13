import os
from google.cloud import storage
from fastapi import UploadFile
from app.core.config import settings

# Note: The google.cloud.storage client will automatically look for
# the GOOGLE_APPLICATION_CREDENTIALS environment variable for authentication.
# If you are running on GCP infrastructure (Compute Engine, Cloud Run, etc),
# it will automatically pick up the default service account credentials.

def get_storage_client() -> storage.Client:
    """Returns a Google Cloud Storage client."""
    if settings.GOOGLE_APPLICATION_CREDENTIALS:
        return storage.Client.from_service_account_json(settings.GOOGLE_APPLICATION_CREDENTIALS)
    return storage.Client()

def upload_file_to_gcs(file_obj: UploadFile, destination_blob_name: str) -> str:
    """
    Uploads a file to the configured Google Cloud Storage bucket.
    
    Args:
        file_obj (UploadFile): The FastAPI UploadFile object.
        destination_blob_name (str): The destination path/filename in the bucket.
        
    Returns:
        str: The public URL or the GS URI of the uploaded file.
    """
    bucket_name = settings.GCP_BUCKET_NAME
    
    if not bucket_name:
        raise ValueError("GCP_BUCKET_NAME is not configured in environment variables.")

    client = get_storage_client()
    bucket = client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)

    # Move to the beginning of the file to ensure we read all of it
    file_obj.file.seek(0)
    
    # Upload the file object directly
    blob.upload_from_file(file_obj.file, content_type=file_obj.content_type)
    
    # You can return the gs:// URI or the public https URL depending on your needs
    # Using gs:// URI as it is commonly used for backend processing
    return f"gs://{bucket_name}/{destination_blob_name}"
