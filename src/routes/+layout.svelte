<script>
    export let data;
</script>

<style>
    


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
            <li><a href="/protected/admin/edit">Edit Cards</a></li>
            {/if}
            <li><a href="/public/landing"
                 on:click={() => document.getElementById("logout").submit()}>Logout</a></li>
            <form id="logout" style="display: none" 
                      action="/public/auth/logout" 
                      method="POST">
                </form>
            
        {/if}
    </ul>
</nav>

<main class = "container">
<slot />
</main>
