/**
 * Hàm tìm Convex Hull sử dụng thuật toán Graham's Scan
 * @param {Array} points - Mảng các điểm [[x1, y1], [x2, y2], ...]
 * @returns {Array} - Polygon bao ngoài
 */
export function grahamScan(points) {
  if (points.length < 3) return points; // Cần ít nhất 3 điểm

  // Bước 1: Tìm điểm có tọa độ y nhỏ nhất (nếu trùng, lấy x nhỏ nhất)
  points.sort((a, b) => (a[1] === b[1] ? a[0] - b[0] : a[1] - b[1]));
  const pivot = points[0];

  // Bước 2: Sắp xếp các điểm theo góc cực với điểm pivot
  points.sort((a, b) => {
    const angleA = Math.atan2(a[1] - pivot[1], a[0] - pivot[0]);
    const angleB = Math.atan2(b[1] - pivot[1], b[0] - pivot[0]);
    return angleA - angleB;
  });

  // Bước 3: Duyệt qua các điểm để tạo Convex Hull
  const stack = [];
  for (const p of points) {
    while (
      stack.length >= 2 &&
      crossProduct(stack[stack.length - 2], stack[stack.length - 1], p) <= 0
    ) {
      stack.pop(); // Loại bỏ điểm nằm bên trong
    }
    stack.push(p);
  }

  console.log(stack,"STACK");
  
  return stack;
}

/**
 * Tính vector tích có hướng giữa ba điểm (p1 -> p2 -> p3)
 * @returns {Number} - Kết quả xác định chiều quay
 */
function crossProduct(p1, p2, p3) {
  return (p2[0] - p1[0]) * (p3[1] - p1[1]) - (p2[1] - p1[1]) * (p3[0] - p1[0]);
}

/**
 * Thuật toán Ramer-Douglas-Peucker để giảm số điểm của polyline
 * @param {Array} points - Mảng điểm [[x1, y1], [x2, y2], ...]
 * @param {Number} epsilon - Ngưỡng độ lệch tối đa (càng nhỏ thì càng giữ nhiều điểm)
 * @returns {Array} - Mảng điểm sau khi giảm
 */
/**
 * Thuật toán Ramer-Douglas-Peucker (RDP) để giảm số điểm của polyline
 * @param {Array} points - Mảng điểm [[x1, y1], [x2, y2], ...]
 * @param {Number} epsilon - Ngưỡng độ lệch tối đa (càng nhỏ thì giữ nhiều điểm)
 * @returns {Array} - Mảng điểm sau khi giảm
 */
function rdpSimplify(points, epsilon) {
    if (points.length < 3) return points; // Không thể giảm nếu ít hơn 3 điểm

    // Tìm điểm xa nhất
    let maxDist = 0;
    let index = -1;
    const start = points[0], end = points[points.length - 1];

    for (let i = 1; i < points.length - 1; i++) {
        const dist = perpendicularDistance(points[i], start, end);
        if (dist > maxDist) {
            maxDist = dist;
            index = i;
        }
    }

    // Nếu khoảng cách lớn hơn epsilon, chia nhỏ để giữ lại điểm quan trọng
    if (maxDist > epsilon) {
        const left = rdpSimplify(points.slice(0, index + 1), epsilon);
        const right = rdpSimplify(points.slice(index), epsilon);
        return left.slice(0, -1).concat(right);
    } else {
        return [start, end]; // Chỉ giữ 2 điểm đầu & cuối
    }
}

/**
 * Tính khoảng cách vuông góc từ một điểm tới một đoạn thẳng
 * @param {Array} point - Điểm cần kiểm tra [x, y]
 * @param {Array} lineStart - Điểm đầu của đoạn thẳng [x, y]
 * @param {Array} lineEnd - Điểm cuối của đoạn thẳng [x, y]
 * @returns {Number} - Khoảng cách vuông góc từ điểm đến đoạn thẳng
 */
function perpendicularDistance(point, lineStart, lineEnd) {
    const [x0, y0] = point, [x1, y1] = lineStart, [x2, y2] = lineEnd;

    // Nếu lineStart và lineEnd trùng nhau, trả về khoảng cách Euclidean
    if (x1 === x2 && y1 === y2) {
        return Math.hypot(x0 - x1, y0 - y1);
    }

    // Công thức khoảng cách vuông góc từ điểm đến đường thẳng
    return Math.abs((y2 - y1) * x0 - (x2 - x1) * y0 + x2 * y1 - y2 * x1) / Math.hypot(x2 - x1, y2 - y1);
}

function toRadians(deg) {
  return deg * Math.PI / 180;
}

// Chuyển đổi radian sang độ
function toDegrees(rad) {
  return rad * 180 / Math.PI;
}

// Hàm tính tọa độ của một điểm mới, dựa vào tâm (lat, lng),
// khoảng cách (km) và góc (bearing) tính từ hướng Bắc.
function getVertex(lat, lng, distance, bearing) {
  // const R = 6371; // Bán kính Trái Đất (km)
  const R = 10500;
  const angularDistance = distance / R;

  // Chuyển sang radian
  const latRad = toRadians(lat);
  const lngRad = toRadians(lng);
  const brngRad = toRadians(bearing);

  // Tính vĩ độ của điểm mới
  const lat2 = Math.asin(Math.sin(latRad) * Math.cos(angularDistance) +
                         Math.cos(latRad) * Math.sin(angularDistance) * Math.cos(brngRad));

  // Tính kinh độ của điểm mới
  const lng2 = lngRad + Math.atan2(Math.sin(brngRad) * Math.sin(angularDistance) * Math.cos(latRad),
                                   Math.cos(angularDistance) - Math.sin(latRad) * Math.sin(lat2));

  return { lat: toDegrees(lat2), lng: toDegrees(lng2) };
}

// Hàm tính các đỉnh của đa giác đều có số cạnh chỉ định
export function getPolygonVertices(centerLat, centerLng, radius, sides) {
  const vertices = [];
  const angleIncrement = 360 / sides;

  // Tạo các đỉnh bằng cách thay đổi góc (bearing)
  for (let i = 0; i < sides; i++) {
    const bearing = i * angleIncrement;
    vertices.push(getVertex(centerLat, centerLng, radius, bearing));
  }
  return vertices;
}
// Ví dụ sử dụng: cho tâm tọa độ (lat, lon) và bán kính 5 km
// const centerLat = 10.762622;  // thay bằng vĩ độ của tâm
// const centerLon = 106.660172; // thay bằng kinh độ của tâm
// const radius = 5; // bán kính 5 km
// const sides = 16;

// const vertices = getPolygonVertices(centerLat, centerLon, radius, sides);
// console.log(vertices);
