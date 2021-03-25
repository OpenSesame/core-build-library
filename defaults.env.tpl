TEST_AWS_SECRET={{ aws_secret:okta/applications/client-reference-browser:client_id }}
TEST_LITERAL=some_value
TEST_ENV_VAR=${windir}
TEST_AWS_SSM={{ aws_ssm_param:/${infra_prefix}/zone/id }}