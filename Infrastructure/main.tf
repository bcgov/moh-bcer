locals {
  common_tags        = var.common_tags
}

data "aws_caller_identity" "current" {}