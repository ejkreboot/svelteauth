<script>
    export let form;
</script>

<style>
article div:nth-of-type(2) {
 background-image:url("/gate.png");
 background-position:center;
 background-size: cover;
}

article {
  padding: 30px; 
}

.message {
 height:30px;
 font-size:14px;
 color: red;
}

</style>

<div class="container">
<article class="grid">
  <div>
    <hgroup>
      <h1>Sign in</h1>
      <h2>a personalized experience awaits.</h2>
    </hgroup>
    <form method="POST">
      <input type="text" name="email" placeholder="you@email.com" aria-label="Login" value={form?.email ?? ''} required>
      <input type="password" name="password" placeholder="password" aria-label="Password" autocomplete="current-password" required>
      <button type="submit" class="contrast" >Login</button>
      <div class=message>{form?.message ?? ''}</div>
    </form>
    <div><small>Forgot password? <a href="/public/auth/forgot">Click here.</a></small></div>
  </div>
  <div></div>
</article>
</div>