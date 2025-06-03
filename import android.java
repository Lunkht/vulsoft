import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.Settings;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class MainActivity extends AppCompatActivity implements AdapterView.OnItemClickListener {
    private static final int PERMISSION_REQUEST_CODE = 100;
    private List<String> fileList = new ArrayList<>();
    private ListView listView;
    private ArrayAdapter<String> adapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        listView = findViewById(R.id.list_view);
        adapter = new ArrayAdapter<>(this, android.R.layout.simple_list_item_1, fileList);
        listView.setAdapter(adapter);
        listView.setOnItemClickListener(this);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.READ_EXTERNAL_STORAGE) == PackageManager.PERMISSION_DENIED) {
                ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.READ_EXTERNAL_STORAGE}, PERMISSION_REQUEST_CODE);
            } else {
                displayFiles();
            }
        } else {
            displayFiles();
        }
    }

    private void displayFiles() {
        File root = new File(Environment.getExternalStorageDirectory().getAbsolutePath());

        fileList.clear();
        for (File file : root.listFiles()) {
            if (file.isDirectory()) {
                fileList.add(file.getName() + "/");
            } else {
                fileList.add(file.getName());
            }
        }
        Collections.sort(fileList);
        adapter.notifyDataSetChanged();
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        if (requestCode == PERMISSION_REQUEST_CODE) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                displayFiles();
            } else {
                Toast.makeText(this, "Permission denied", Toast.LENGTH_SHORT).show();
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    if (shouldShowRequestPermissionRationale(Manifest.permission.READ_EXTERNAL_STORAGE)) {
                        ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.READ_EXTERNAL_STORAGE}, PERMISSION_REQUEST_CODE);
                    } else {
                        Intent intent = new Intent();
                        intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                        Uri uri = Uri.fromParts("package", getPackageName(), null);
                        intent.setData(uri);
                        startActivity(intent);
                    }
                }
            }
        }
    }

    @Override
    public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
        String fileName = fileList.get(position);
        File file = new File(Environment.getExternalStorageDirectory().getAbsolutePath() + "/" + fileName);
        if (file.isDirectory()) {
            Intent intent = new Intent(this, DirectoryActivity.class);
            intent.putExtra("DIRECTORY_PATH", file.getAbsolutePath());
            startActivity(intent);
        } else {
            String mimeType = getMimeType(file);
            if (mimeType != null) {
                if (mimeType.startsWith("image")) {
                    Intent intent = new Intent(this, ImageActivity.class);
                    intent.putExtra("IMAGE_PATH", file.getAbsolutePath());
                    startActivity(intent);
                } else if (mimeType.startsWith("video")) {
                    Intent intent = new Intent(this, VideoActivity.class);
                    intent.putExtra("VIDEO_PATH", file.getAbsolutePath());
                    startActivity(intent);
                } else if (mimeType.startsWith("audio")) {
                    Intent intent = new Intent(this, AudioActivity.class);
                    intent.putExtra("AUDIO_PATH", file.getAbsolutePath());
                    startActivity(intent);
                } else if (mimeType.equals("application/vnd.android.package-archive
                ")) {
                    Intent intent = new Intent(Intent.ACTION_VIEW);
                    intent.setDataAndType(Uri.fromFile(file), "application/vnd.android.package-archive");
                    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    startActivity(intent);
                } else {
                    Toast.makeText(this, "Cannot open file", Toast.LENGTH_SHORT).show();
                }
            } else {
                Toast.makeText(this, "Cannot determine file type", Toast.LENGTH_SHORT).show();
            }
        }
    }
}