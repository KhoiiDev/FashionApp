package com.project.fashionapp.controllers;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import android.app.ProgressDialog;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Toast;

import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.project.fashionapp.R;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class RegisterActivity extends AppCompatActivity {

    private EditText ipRegisterEmail, ipRegisterPass, ipConfirmPassword;
    private ImageView imgBack,icGoogle,icFacebook ;
    private Button btRegisterToHome;
    private ProgressDialog progressDialog;


    private FirebaseAuth mAuth;

    private GoogleSignInOptions googleSignInOptions;
    private GoogleSignInClient googleSignInClient;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);
        Initialize();
        CreateOnClick();
    }

    public static boolean isValidEmail(String email) {
        String emailRegex = "^[\\w\\.-]+@([\\w\\-]+\\.)+[A-Z]{2,4}$";
        Pattern pattern = Pattern.compile(emailRegex, Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(email);
        return matcher.matches();
    }


    public void RegisterAnAccount(){
        String email = ipRegisterEmail.getText().toString().trim();
        String password = ipRegisterPass.getText().toString().trim();
        String ConfirmPass = ipConfirmPassword.getText().toString().trim();

        if(TextUtils.isEmpty(email) || !isValidEmail(email)){
            ipRegisterEmail.setError("Please input your email");
            return;
        }
        if(TextUtils.isEmpty(password)){
            ipRegisterPass.setError("Please input your password");
            return;
        }
        if(password.length() < 6 ){
            ipRegisterPass.setError("Password must be at least 6 characters");
            return;
        }
        if(TextUtils.isEmpty(ConfirmPass)){
            ipRegisterPass.setError("Please confirm your password");
            return;
        }
        if(!password.equals(ConfirmPass)){
            ipConfirmPassword.setError("Confirm your password is incorrect");
            return;
        }
        // Check if user is signed in (non-null) and update UI accordingly.
        FirebaseUser currentUser = mAuth.getCurrentUser();
        if(currentUser != null){
            Toast.makeText(this, "logged", Toast.LENGTH_SHORT).show();
            return;
        }
        progressDialog.show();
        mAuth.createUserWithEmailAndPassword(email, password)
                .addOnCompleteListener(this, new OnCompleteListener<AuthResult>() {
                    @Override
                    public void onComplete(@NonNull Task<AuthResult> task) {
                        progressDialog.dismiss();
                        if (task.isSuccessful()) {
                            // Sign in success, update UI with the signed-in user's information
                            Toast.makeText(RegisterActivity.this, "Authentication success.", Toast.LENGTH_SHORT).show();
                            Intent intent = new Intent(RegisterActivity.this, HomeActivity.class);
                            startActivity(intent);
                            finishAffinity();
                        } else {
                            // If sign in fails, display a message to the user.
                            Toast.makeText(RegisterActivity.this, "Email already exists",Toast.LENGTH_SHORT).show();
                        }
                    }
                });
    }

    public void Initialize(){
        imgBack = (ImageView) findViewById(R.id.imgBack);
        icGoogle = (ImageView) findViewById(R.id.icGoogle);
        ipRegisterEmail = (EditText) findViewById(R.id.ipRegisterEmail);
        ipRegisterPass = (EditText) findViewById(R.id.ipRegisterPass);
        ipConfirmPassword = (EditText) findViewById(R.id.ipConfirmPassword);
        btRegisterToHome = (Button) findViewById(R.id.btRegisterToHome);
        mAuth = FirebaseAuth.getInstance();
        googleSignInOptions = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestEmail()
                .build();

        googleSignInClient = GoogleSignIn.getClient(this, googleSignInOptions);

        progressDialog = new ProgressDialog(this);
        progressDialog.setMessage("Please wait...");
    }

    public void CreateOnClick(){
        imgBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent();
//              intent.putExtra("data", "Some data");
                setResult(RESULT_OK, intent);
                finish();
            }
        });

        btRegisterToHome.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                RegisterAnAccount();
            }
        });

        icGoogle.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                progressDialog.show();
                new Handler().postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        progressDialog.dismiss();
                        SignInGoogle();
                    }
                }, 2000);
            }
        });
    }

    public void SignInGoogle(){
        Intent intent = googleSignInClient.getSignInIntent();
        startActivityForResult(intent, 100);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if(requestCode == 100){
            try {
                Task<GoogleSignInAccount> task = GoogleSignIn.getSignedInAccountFromIntent(data);
                finish();
                Intent intent = new Intent(getApplicationContext(), HomeActivity.class);
                startActivity(intent);
                task.getResult(ApiException.class);
            } catch (ApiException e) {
                Toast.makeText(this, "Error", Toast.LENGTH_SHORT).show();
            }
        }
    }
}