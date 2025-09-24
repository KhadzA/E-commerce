import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

function Orders() {
    const [orders, setOrders] = useState<{ name: string }[]>([]);

    useEffect(() => {
      const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      setOrders(storedOrders);
    }, []);

    return (
      <div>
        <div className="cartList">
          {orders.map((item, index) => {
            return (
              <div key={index}>
                <span className="product-images">img</span>
                <br />
                {item.name}
                <br />
              </div>
            );
          })}
        </div>
        
        <br />
      </div>
    );
}

export default Orders;
