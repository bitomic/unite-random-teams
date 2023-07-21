<script>

    import { _ } from '$lib/client/stores/i18n'

</script>

<svelte:head>
	<title> Privacy Policy | { $_.get( 'navigation.title' ) } </title>
</svelte:head>

<h2> Privacy Policy </h2>

<p> <b>Last Update:</b> July 21st, 2023 </p>

<p> Nothing is stored from you if you don't login into the website using your Twitch account. </p>

<p> If you choose to login using your Twitch account to use the exclusive features, it will use a cookie in your browser to identify your session. This cookie holds a random identifier that is used to fetch anything we store from you into our server. This server is currently located in Germany, and your information will only be stored there until it is removed. </p>

<p> We will only store an <a href="https://dev.twitch.tv/docs/authentication/#user-access-tokens">user access token</a> to interact with Twitch's API on behalf of you. Currently, the application will ask for the following permissions when you authorize it to access your account: </p>

<ul>
	<li> <b> Manage announcements. </b> Send an announcement in your stream's chat. This will be used to send both teams' members and Pokémon. </li>
	<li> <b> Manage predictions. </b> Create and finish predictions about who will win a match. </li>
</ul>

<p> These permissions are only used if you press the button to perform the corresponding action. No message nor action will be performed unless you initiate it by interacting with the interface. </p>

<p> By default, user access tokens expire after approximately 4 hours. After this, your token can't be used anymore. It is removed from our storage around the same time. If you use the "Disconnect" button, it will be removed immediately. </p>