include {
  path = find_in_parent_folders()
}

generate "prod_tfvars" {
  path              = "dev.auto.tfvars"
  if_exists         = "overwrite"
  disable_signature = true
  contents          = <<-EOF
  environment = "dev"
  fargate_cpu = 512
  fargate_memory = 1024
  app_port = 21000
  EOF
}
