docker build -t construction-site-management-portal .
docker save -o construction-site-management-portal.tar construction-site-management-portal
scp construction-site-management-portal.tar iwcadmin@SCDT-AI:~/construction-site-management-portal.tar