terraform {
  backend "s3" {
    bucket = "onge-test-dev"
    key    = "terraform/backend.tf"
    region = "us-east-1"
  }
}
