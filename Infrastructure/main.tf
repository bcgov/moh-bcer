terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3"
    }
  }
  required_version = "~> 1.3.7"
}

locals {
  common_tags = var.common_tags
}

data "aws_caller_identity" "current" {}
