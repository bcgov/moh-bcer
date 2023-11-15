include {
  path = find_in_parent_folders()
}

locals {
  # project = get_env("LICENSE_PLATE  ")
  project =   "q9y1j9"
#   commontags = [
#     environment = "dev",
#     application = "fmdb"
#   ]
}

generate "dev_tfvars" {
  path              = "dev.auto.tfvars"
  if_exists         = "overwrite"
  disable_signature = true
  contents          = <<-EOF
  fargate_cpu = 512
  fargate_memory = 1024
  app_port = 4000
  fam_console_idp_name = "DEV-IDIR"
  EOF
}