docker build -t construction-site-management-portal .
docker save -o construction-site-management-portal.tar construction-site-management-portal
scp construction-site-management-portal.tar iwcadmin@SCDT-AI:~/construction-site-management-portal.tar
ssh iwcadmin@SCDT-AI "docker load -i ~/construction-site-management-portal.tar && rm ~/construction-site-management-portal.tar && docker-compose -f ~/docker/construction-site-management/docker-compose.yaml up -d"
Remove-Item construction-site-management-portal.tar


