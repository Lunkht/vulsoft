findViewById(R.id.log_in).setOnClickListener(new View.OnClickListener() {
    @Override
    public void onClick(View view) {
        String email = ((EditText) findViewById(R.id.user_email)).getText().toString();
        String password = ((EditText) findViewById(R.id.password)).getText().toString();

        mAuth.signInWithEmailAndPassword(email, password)
                .addOnCompleteListener(YourActivity.this, new OnCompleteListener<AuthResult>() {
                    @Override
                    public void onComplete(@NonNull Task<AuthResult> task) {
                        if (task.isSuccessful()) {
                            // Sign in success
                            FirebaseUser user = mAuth.getCurrentUser();
                            // Do something with the user object
                        } else {
                            // Sign in failed
                            Toast.makeText(YourActivity.this, "Authentication failed.", Toast.LENGTH_SHORT).show();
                        }
                    }
                });
    }
});
