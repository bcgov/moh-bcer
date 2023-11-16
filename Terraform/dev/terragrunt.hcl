include {
  path = find_in_parent_folders()
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
  application = "bcer"
  aurora_acu_min = 0.5
  aurora_acu_max = 1
  EOF
}
