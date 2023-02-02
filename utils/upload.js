import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';

const storage = new GridFsStorage({
    url: `mongodb://Shubhangi:Shrestha@ac-gb3bzox-shard-00-00.ebsmxku.mongodb.net:27017,ac-gb3bzox-shard-00-01.ebsmxku.mongodb.net:27017,ac-gb3bzox-shard-00-02.ebsmxku.mongodb.net:27017/?ssl=true&replicaSet=atlas-1huc15-shard-0&authSource=admin&retryWrites=true&w=majority`,
    options: { useNewUrlParser: true },
    file: (request, file) => {
        const match = ["image/png", "image/jpg"];

        if(match.indexOf(file.memeType) === -1) 
            return`${Date.now()}-blog-${file.originalname}`;

        return {
            bucketName: "photos",
            filename: `${Date.now()}-blog-${file.originalname}`
        }
    }
});

export default multer({storage}); 