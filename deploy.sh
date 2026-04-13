server=root@14.225.210.29
path=/root/server/landing_page
yarn build

ssh $server 'mkdir -p /root/server/landing_page
cd '$path'
rm -rf .next
'

rsync -avz --progress ./.next $server:$path/
rsync -avz --progress package.json $server:$path/
rsync -avz --progress Dockerfile $server:$path/
rsync -avz --progress ./public $server:$path/

ssh $server '
cd '$path'
container_name=landing_page
port=3103
container=$(docker ps -a -q --filter name="$container_name")
echo "Container ID: $container"

# Dừng và xóa container cũ nếu tồn tại
# if [ ! -z "$container" ]; then
#     echo "Dừng và xóa container cũ..."
#     docker stop "$container_name" || true
#     docker rm "$container_name" || true
# fi

# Build và chạy container mới
echo "Build và chạy container mới..."
    
# xóa build cũ trong container và copy build mới vào
if [ ! -z "$container" ]; then
    echo "Copy build mới vào container..."
    # docker cp .next/. "$container":/app/.next/
    docker cp .next/. "$container_name":/app/.next/
    docker cp public/. "$container_name":/app/public/
    docker restart "$container_name"
else
    echo "Container không tồn tại, không thể copy files"
fi
# docker build --no-cache -t "$container_name" .
# docker run -t -d -p $port:3000 --name "$container_name" "$container_name"
'