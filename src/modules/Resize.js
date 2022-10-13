const {v4} = require('uuid');
const path = require("path");
const fs = require("fs");


function utf8_khong_dau(text) {
    const AccentsMap = [
        "uùủũúụưừửữứựUÙỦŨÚỤƯỪỬỮỨỰ",
        "eèẻẽéẹêềểễếệEÈẺẼÉẸÊỀỂỄẾỆ",
        "oòỏõóọôồổỗốộơờởỡớợOÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
        "aàảãáạăằẳẵắặâầẩẫấậAÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
        "iìỉĩíịIÌỈĨÍỊ",
        "dđDĐ",
        "yỳỷỹýỵYỲỶỸÝỴ",
    ];
    for (let i=0; i<AccentsMap.length; i++) {
        const regex = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g');
        const char_first = AccentsMap[i][0];
        text = text.replace(regex, char_first);
    }
    return text;
}

class Resize {

    constructor(folder) {
        this.folder = folder;
    }

    save(buffer, file_name) {
        //file name cắt tên file split('.') thành dạng uuid.typefile(.png.jpg) mặc định .bin
        //check sau dấu . typefile là tiếng việt không dấu
        const filename = this.filename(file_name);
        const filepath=this.filepath(filename);
        return new Promise((resolve, reject) => {
            fs.writeFile(filepath,buffer,(err)=>{
                if(err) {
                    reject(err);
                }
                return resolve(filename)
            })
        })

    }

    filename(file_name) {
        let x = file_name.split('.');
        let file_type = 'bin';
        if (x.length > 0) {
            let _file_type = x[x.length - 1];
            if (_file_type == utf8_khong_dau(_file_type)) file_type = _file_type
        }
        return `${v4()}.${file_type}`;
    }

     filepath(file_name) {
       return  path.resolve(`${this.folder}/${file_name}`)
    }
}

module.exports = Resize;