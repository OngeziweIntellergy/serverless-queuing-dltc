################
# DynamoDB Table
################
resource "aws_dynamodb_table" "ticket_table" {
  name         = "TICKET"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "ticket_id"

  attribute {
    name = "ticket_id"
    type = "S"
  }

  attribute {
    name = "category"
    type = "S"
  }

  attribute {
    name = "product_rating"
    type = "N"
  }

  global_secondary_index {
    name            = "ticketCategoryRatingIndex"
    hash_key        = "category"
    range_key       = "product_rating"
    projection_type = "ALL"
  }
}
