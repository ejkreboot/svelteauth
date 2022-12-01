<script>
    export let data;
</script>

<style>
    
.link-button {
    cursor:pointer;
    margin:30px 0px 0px 0px;
    height: 40px;
    padding: 0px 20px 0px 20px;
}
</style>

<svelte:head>
<title>Auth Example</title>
</svelte:head>

<nav class="container-fluid">
    <ul>
        <li><strong>Simple Auth</strong></li>
    </ul>
    <ul>
        {#if !data.email}
            <li><a href="/public/auth/login">Login</a></li>
            <li><a href="/public/auth/register">Register</a></li>
        {/if}
        
        {#if data.email}
            {#if data.group == "admin"}
            <li><a href="/protected/admin">Admin</a></li>
            {:else}
            <li>You are not an admin</li>
            {/if}
            <li><form action="/public/auth/logout" method="POST"><button class=link-button type="submit">Log out</button></form></li>
        {/if}
    </ul>
  </nav>
<main class = "container">
<slot />
</main>
