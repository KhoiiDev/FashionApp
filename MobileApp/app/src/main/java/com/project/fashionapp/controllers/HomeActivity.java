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

    @SuppressLint("NotifyDataSetChanged")
    public void setCategory(){
        DatabaseReference databaseRef = FirebaseDatabase.getInstance().getReference("CategoryData");

        String categoryId = databaseRef.push().getKey();
        List<String> listImage = new ArrayList<>();
        listImage.add("https://storage.googleapis.com/fashionappdatabase.appspot.com/Category/1685175916934-shorts.png?GoogleAccessId=firebase-adminsdk-3z6kz%40fashionappdatabase.iam.gserviceaccount.com&Expires=1742144400&Signature=kdIl4hvhyJyyZpHV9kvYS%2FKA3ZfAL3eEH2NWLarhcpaxzZ1ig1cGukF65NUCVGWhUr2CklKLp1C9zKF%2F7XLJn9aB2v9pMjEI7zaPN5VMf28%2FkbcDjSaCUqCuFQbfOMOppN5aGwO8d3xCCXdLeDKP58EOMoTkb8hvasDWFtKNSoZTaEj1GIB8w4h0csOEkYdn4sSuvGOef%2FgWG%2B%2BkqylQWrp%2Fhk1zuPR2%2BgN%2BUKs82JYnjMWvlr5t6a5IGPDYzR7BYfzEh%2BWAwohkNYFt9GzggbHb43oemq3FnNCByBvA6e4UAQQEyhlfYTig1p%2BGiuUFOBjv4uWRfpu7z7FZqgx%2BWA%3D%3D");
        Category categoryAdd = new Category(categoryId, "Shorts", listImage , "Shorts", new SimpleDateFormat("dd/MM/yyyy HH:mm:ss").format(new Date()));
        listCategory.add(categoryAdd);
        categoryAdapter.notifyDataSetChanged();

        databaseRef.child(categoryId).setValue(categoryAdd);
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