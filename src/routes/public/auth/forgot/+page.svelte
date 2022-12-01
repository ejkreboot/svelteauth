<script>
    export let form;
</script>

<style>
article div:nth-of-type(2) {
 background-image:url("/forget.jpg");
 background-position:center;
 background-size:cover;
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
      <h1>Reset your password</h1>
      <h2>yeah, I can't remember either.</h2>
    </hgroup>
    <form method="POST">
      {#if !form?.success}
      <input type="text" name="email" placeholder="you@email.com" aria-label="Login" value={form?.email ?? ''} required>
      <input type="password" name="password" placeholder="new password" aria-label="Password" autocomplete="current-password" required>
      <button type="submit" class="contrast" >Submit</button>
      {:else}
      <p>Enter verification code:</p>
      <input type="hidden" name="email" value={form?.email ?? ''}>
      <input type="hidden" name="password" value={form?.password ?? ''}>
      <input type="text" name="key_code" placeholder="000000" aria-label="Key Code" required>
      <button type="submit" class="contrast" >Verify</button>
      {/if}
      <div class=message>{form?.message ?? ''}</div>
    </form>
  </div>
  <div></div>
</article>