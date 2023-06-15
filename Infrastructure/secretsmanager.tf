resource "aws_secretsmanager_secret" "bcer_proxy_user" {
  name = "bcer_user"
}

resource "aws_secretsmanager_secret_version" "rds_credentials" {
  secret_id     = aws_secretsmanager_secret.bcer_proxy_user.id
  secret_string = <<EOF
{
  "username": "bcer",
  "password": "changeme",
  "engine": "${data.aws_rds_engine_version.postgresql.version}",
  "host": "${module.aurora_postgresql_v2.cluster_endpoint}",
  "port": ${module.aurora_postgresql_v2.cluster_port},
  "dbClusterIdentifier": "${module.aurora_postgresql_v2.cluster_id}"
}
EOF
lifecycle {
  ignore_changes = [ secret_string ]
}
}