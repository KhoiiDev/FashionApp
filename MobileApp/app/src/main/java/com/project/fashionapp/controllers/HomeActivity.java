package com.project.fashionapp.controllers;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;
import com.project.fashionapp.R;
import com.project.fashionapp.adapter.CategoryAdapter;
import com.project.fashionapp.model.Category;
import com.project.fashionapp.model.Color;
import com.project.fashionapp.model.Products;
import com.project.fashionapp.model.Sizes;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

public class HomeActivity extends AppCompatActivity {

    private Button btLogout;
    private TextView tvEmailHome, tvName;
    private CategoryAdapter categoryAdapter;
    private RecyclerView rcvCategory;
    private List<Category> listCategory = new ArrayList<>();
    private GoogleSignInOptions googleSignInOptions;
    private GoogleSignInClient googleSignInClient;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);
        Initialize();
        CreateOnClick();
        CreateProFile();
        CreateCategory();
        getDataCategories();
//        setCategory();
    }

    @SuppressLint("NotifyDataSetChanged")
    public void CreateCategory(){
        categoryAdapter = new CategoryAdapter(this);
        categoryAdapter.setData(listCategory);
        LinearLayoutManager linearLayoutManager = new LinearLayoutManager(this, RecyclerView.HORIZONTAL, false);
        rcvCategory.setLayoutManager(linearLayoutManager);
        rcvCategory.setAdapter(categoryAdapter);
    }

    public void CreateProFile(){
        GoogleSignInAccount account = GoogleSignIn.getLastSignedInAccount(this);
        if(account != null){
            String Name = account.getDisplayName();
            String Email = account.getEmail();

            tvName.setText(Name);
            tvEmailHome.setText(Email);
        }
    }

    public void getDataCategories() {
        DatabaseReference databaseRef = FirebaseDatabase.getInstance().getReference("CategoryData");

        databaseRef.addListenerForSingleValueEvent(new ValueEventListener() {
            @SuppressLint("NotifyDataSetChanged")
            @Override
            public void onDataChange(@NonNull DataSnapshot dataSnapshot) {
//                List<Category> listCategory = new ArrayList<>();
                for (DataSnapshot snapshot : dataSnapshot.getChildren()) {
                    Category category = snapshot.getValue(Category.class);
                    if (category != null) {
                        listCategory.add(category);
                    }
                }
                categoryAdapter.notifyDataSetChanged();
            }

            @Override
            public void onCancelled(@NonNull DatabaseError databaseError) {
                Toast.makeText(HomeActivity.this, "loadPost:onCancelled", Toast.LENGTH_SHORT).show();

            }
        });
    }

    public void Initialize(){
        tvName = (TextView) findViewById(R.id.tvName);
        tvEmailHome = (TextView) findViewById(R.id.tvEmailHome);
        btLogout = (Button) findViewById(R.id.btLogout);
        rcvCategory = (RecyclerView) findViewById(R.id.rcvCategory);
        googleSignInOptions = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestEmail()
                .build();

        googleSignInClient = GoogleSignIn.getClient(this, googleSignInOptions);
    }

    public void CreateOnClick(){
        btLogout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                FirebaseAuth.getInstance().signOut();
                Intent intent = new Intent(HomeActivity.this, MainActivity.class);
                startActivity(intent);
            }
        });
    }
}