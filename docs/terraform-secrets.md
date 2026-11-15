# Infraestructura como Código y Gestión de Secretos

Terraform permite describir la infraestructura mediante archivos de configuración controlados por versiones. Este enfoque mejora la reproducibilidad, la trazabilidad y la consistencia entre los diferentes entornos. En STRNG, la carpeta `terraform/` representa un despliegue IaaS opcional para el backend y, por defecto, no crea recursos facturables.

Los valores sensibles nunca deben almacenarse directamente en los archivos de Terraform, los workflows o el repositorio público. Las cadenas de conexión de la base de datos, las claves de firma JWT, los secretos de los tokens de actualización y las credenciales de la nube se suministran mediante variables de entorno protegidas, almacenes locales de credenciales o secretos de GitHub Actions. El archivo `.env.example` incluido en el proyecto contiene únicamente valores de referencia y marcadores de posición.

El workflow de integración continua utiliza valores que no pertenecen a producción y una base de datos temporal para las pruebas. Un workflow de producción debe utilizar secretos asociados al entorno, permisos restringidos y medidas que impidan imprimirlos en los registros. El estado de Terraform puede contener atributos sensibles; por ello, un despliegue compartido debe utilizar un backend remoto cifrado, control de acceso y bloqueo del estado.

La separación entre configuración y secretos forma parte del límite de seguridad del sistema: la configuración describe cómo se despliega la aplicación, mientras que los secretos se inyectan únicamente durante la ejecución. Esto reduce el riesgo de exposición accidental mediante commits, artefactos, registros de CI o Pull Requests.

Los comandos principales de validación son `terraform fmt`, `terraform init`, `terraform validate` y `terraform plan`. En este proyecto se utiliza la validación de la configuración sin ejecutar `terraform apply`, con el fin de documentar la infraestructura sin crear recursos reales ni generar costos.
