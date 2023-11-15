output "target_env" {
  description = "dev, test, or prod in AWS"
  value = var.target_env
}

output "fam_console_idp_name" {
  description = "Identifies which version of IDIR to use (DEV, TEST, or PROD)"
  value = var.fam_console_idp_name
}
