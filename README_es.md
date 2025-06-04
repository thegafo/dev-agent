agente dev es un agente minimalista de desarrollo de software

genera un árbol de proyecto para dar contexto y usa herramientas para leer/editar archivos según sea necesario para completar solicitudes del usuario

necesita `OPENROUTER_API_KEY` o es inútil

se instala con `npm i -g dev-agent`

se ejecuta con `da -m <model>`

```
Opciones:
  -V, --version               muestra el número de versión
  -m, --model <model>         Especifica el modelo a usar o busca modelos disponibles
  -i, --ignore <lista de ignorados>  Lista de directorios o archivos a ignorar
  -p, --prompt <ruta del prompt>  Ruta al archivo de prompt personalizado
  -b, --balance               Muestra el saldo restante en la clave API
  -h, --help                  muestra la ayuda del comando
```