server=root@14.225.210.29
path=/root/server/nextjs-landing-page
yarn build

ssh $server 'mkdir -p /root/server/nextjs-landing-page
cd '$path'
rm -rf .next
'

scp -r ./.next $server:$path/
scp package.json $server:$path/package.json
scp Dockerfile $server:$path/Dockerfile
scp -r ./public $server:$path/

ssh $server '
cd '$path'
container_name=nextjs-landing-page
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
docker build --no-cache -t "$container_name" .
docker run --read-only -t -d -p $port:3000 --name "$container_name" "$container_name"
    
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