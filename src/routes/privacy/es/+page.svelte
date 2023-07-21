<script>

    import { _ } from '$lib/client/stores/i18n'

</script>

<svelte:head>
	<title> Política de privacidad | { $_.get( 'navigation.title' ) } </title>
</svelte:head>

<h2> Política de privacidad </h2>

<p> <b>Última actualización:</b> 21 de julio de 2023 </p>

<p> No se almacena nada de ti si no inicias sesión en el sitio web usando tu cuenta de Twitch. </p>

<p> Si decides iniciar sesión con tu cuenta de Twitch para usar las funcionalidades exclusivas, se usará una cookie en tu navegador para identificar tu sesión. Esta cookie almacena un identificador aleatorio que se usa para recuperar del servidor lo que sea que se almacene de ti. El servidor actualmente se ubica en Alemania, y tu información solo se almacenará ahí hasta que sea eliminada. </p>

<p> Únicamente almacenamos una <i><a href="https://dev.twitch.tv/docs/authentication/#user-access-tokens">user access token</a></i> para interactuar con la API de Twitch en tu nombre. Actualmente, la aplicación solicita los siguientes permisos al autorizarle el acceso a tu cuenta: </p>

<ul>
	<li> <b> Gestionar mensajes de anuncio. </b> Envía un anuncio en el chat de tu stream. Esto se usa para enviar los miembros y Pokémon de cada equipo. </li>
	<li> <b> Gestionar predicciones. </b> Crea y finaliza predicciones sobre qué equipo ganará el encuentro. </li>
</ul>

<p> Estos permisos solo son usados si presionas el botón para realizar la acción correspondiente. No se enviará ningún mensaje ni se realizará ninguna acción a menos que la inicies al interactuar con la interfaz. </p>

<p> De manera predeterminada, los <i>user access tokens</i> expiran después de 4 horas. Posteriormente, no puede seguir siendo usada. Se elimina de nuestro almacenamiento alrededor del mismo tiempo. Si usas el botón de "Desconectar", se eliminará inmediatamente. </p>
