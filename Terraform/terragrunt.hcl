terraform {
  source = "../../Infrastructure"
}
 locals {
    project             = get_env("LICENSE_PLATE")
    environment         = reverse(split("/", get_terragrunt_dir()))[0]
    app_image           = get_env("app_image", "")
 }

generate "remote_state" {
  path      = "backend.tf"
  if_exists = "overwrite"
  contents  = <<EOF
terraform {
  backend "s3" {
    bucket         = "terraform-remote-state-${ local.project }-${ local.environment }"
    key            = "${ local.project }/${ local.environment }/bcer-app.tfstate"
    dynamodb_table = "terraform-remote-state-lock-${ local.project }"
    region         = "ca-central-1"
    encrypt        = true
    
  }
}
EOF
}


generate "tfvars" {
  path              = "terragrunt.auto.tfvars"
  if_exists         = "overwrite"
  disable_signature = true
  contents          = <<-EOF
    app_image  = "${local.app_image}"
    target_env = "${local.environment}"  
    application = "bcer"
    license = "${local.project}"
EOF
}


generate "provider" {
  path      = "provider.tf"
  if_exists = "overwrite"
  contents  = <<EOF
provider "aws" {
  region  = var.aws_region
}
EOF
}
