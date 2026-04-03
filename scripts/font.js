const fs = require("fs");
const path = require("path");

const folderPath = "../android/app/src/main/res/font"; // Thay bằng đường dẫn thư mục của bạn

fs.readdir(folderPath, (err, files) => {
    if (err) {
        console.error("Lỗi khi đọc thư mục:", err);
        return;
    }

    files.forEach(file => {
        const oldPath = path.join(folderPath, file);
        const newFileName = file.toLowerCase().replaceAll(/-/g, "_").replaceAll(" ", "_");
        const newPath = path.join(folderPath, newFileName);

        if (oldPath !== newPath) {
            fs.rename(oldPath, newPath, err => {
                if (err) {
                    console.error("Lỗi khi đổi tên:", err);
                } else {
                    console.log(`Đổi tên: ${file} -> ${newFileName}`);
                }
            });
        }
    });
});
