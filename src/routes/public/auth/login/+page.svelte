<script>
    export let form;
</script>

<style>
article div:nth-of-type(2) {
 background-color:#374956;
 background-image:url("/gate.png");
 background-position:center;
 background-size:cover;
 margin: -30px -30px -30px 10px;
 padding:-10px;
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
  </div>
  <div></div>
</article>