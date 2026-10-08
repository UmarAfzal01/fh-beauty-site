import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function GET(request) {
  try {
    await dbConnect();
    const orders = await Order.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, count: orders.length, orders }, { status: 200 });
  } catch (error) {
    console.error("API Error fetching orders:", error);
    return NextResponse.json({ success: false, message: error.message || "Failed to fetch orders." }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { customer, items, totalAmount } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, message: "Your cart is empty." }, { status: 400 });
    }

    if (!customer || !customer.fullName || !customer.phone || !customer.address || !customer.city) {
      return NextResponse.json({ success: false, message: "Please fill in all required shipping details." }, { status: 400 });
    }

    const orderItems = items.map((item) => ({
      productId: item.productId || item._id || "N/A",
      name: item.name || "Item",
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,
      selectedOption: item.selectedOption || "Standard",
      image: item.image || "",
    }));

    const newOrder = await Order.create({
      orderItems,
      shippingInfo: {
        fullName: customer.fullName,
        phone: customer.phone,
        email: customer.email || "",
        address: customer.address,
        city: customer.city,
      },
      subtotal: totalAmount,
      shippingFee: 0,
      totalAmount: totalAmount,
      paymentMethod: "COD",
      paymentStatus: "Pending",
      orderStatus: "Pending",
    });

    // Send email with Logo and Product Images
    const customerEmail = customer.email;
    if (customerEmail && customerEmail.trim() !== "") {
      try {
        const itemsHtmlList = orderItems
          .map(
            (item) => `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #E6DEC9; width: 50px;">
                  ${
                    item.image
                      ? `<img src="${item.image}" alt="${item.name}" style="width: 44px; height: 44px; object-fit: cover; border-radius: 8px; border: 1px solid #E6DEC9;" />`
                      : `<div style="width: 44px; height: 44px; background: #FAF7F3; border-radius: 8px; border: 1px solid #E6DEC9;"></div>`
                  }
                </td>
                <td style="padding: 10px 0; color: #514C48; border-bottom: 1px solid #E6DEC9; font-size: 13px;">
                  <strong>${item.name}</strong><br/>
                  <span style="font-size: 11px; opacity: 0.7;">Variant: ${item.selectedOption} | Qty: ${item.quantity}</span>
                </td>
                <td style="padding: 10px 0; color: #111; font-weight: bold; text-align: right; border-bottom: 1px solid #E6DEC9; font-size: 13px;">
                  PKR ${(item.price * item.quantity).toLocaleString()}
                </td>
              </tr>
            `
          )
          .join("");

        await transporter.sendMail({
          from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
          to: customerEmail,
          subject: `Order Confirmation #${newOrder._id.toString().slice(-6).toUpperCase()}`,
          html: `
            <div style="font-family: Georgia, serif; color: #514C48; background-color: #FAF7F3; padding: 50px 20px; max-width: 620px; margin: 0 auto;">
              
              <div style="background-color: #ffffff; padding: 48px 36px; border-radius: 28px; border: 1px solid #E6DEC9; text-align: center;">
                
                <!-- Logo Top -->
                <div style="margin-bottom: 24px;">
                  <img src="https://res.cloudinary.com/wapixih0/image/upload/v1790707283/Logo.png" alt="Store Logo" style="max-width: 130px; height: auto; display: block; margin: 0 auto;" />
                </div>

                <p style="font-family: sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 0.25em; color: #514C48; margin-bottom: 12px; font-weight: 600;">
                  THANK YOU • ${customer.fullName}
                </p>

                <h1 style="font-size: 32px; color: #111111; margin-top: 0; margin-bottom: 16px; font-weight: normal; line-height: 1.15;">
                  Your order is confirmed!
                </h1>

                <p style="font-size: 15px; color: #514C48; line-height: 1.6; max-width: 440px; margin: 0 auto 30px auto;">
                  We have received your order and our team is getting it ready for delivery to <strong>${customer.city}</strong>.
                </p>

                <!-- Order Details Summary Box -->
                <div style="margin: 0 auto 30px auto; padding: 20px 24px; background-color: #FAF7F3; border-radius: 16px; border: 1px solid #E6DEC9; text-align: left; max-width: 480px;">
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td colspan="3" style="padding-bottom: 10px; font-weight: bold; color: #111; border-bottom: 1px solid #E6DEC9; font-size: 13px;">
                        Order Items Summary
                      </td>
                    </tr>
                    ${itemsHtmlList}
                    <tr>
                      <td colspan="2" style="padding: 14px 0 4px 0; color: #514C48; font-weight: bold; font-size: 13px;">Total Amount:</td>
                      <td style="padding: 14px 0 4px 0; color: #111; font-weight: bold; font-size: 15px; text-align: right;">
                        PKR ${totalAmount.toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2" style="padding: 4px 0; color: #514C48; opacity: 0.7; font-size: 12px;">Payment Method:</td>
                      <td style="padding: 4px 0; color: #111; text-align: right; font-size: 12px;">Cash on Delivery (COD)</td>
                    </tr>
                  </table>
                </div>

                <div style="margin-bottom: 30px;">
                  <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://yourwebsite.com'}" target="_blank" rel="noopener noreferrer" style="background-color: #111; color: #FAF7F3; padding: 14px 32px; border-radius: 50px; font-family: sans-serif; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.2em; text-decoration: none; display: inline-block;">
                    CONTINUE SHOPPING →
                  </a>
                </div>

                <div style="border-top: 1px solid #E6DEC9; padding-top: 20px; margin-top: 20px;">
                  <p style="font-size: 11px; color: rgba(81, 76, 72, 0.6); margin: 0;">
                    Thank you for shopping with us! If you have any questions, feel free to reply to this email.
                  </p>
                </div>

              </div>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("Order confirmation email sending failed:", emailError);
      }
    }

    return NextResponse.json(
      { success: true, message: "Order placed successfully!", orderId: newOrder._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("API Error placing order:", error);
    return NextResponse.json({ success: false, message: error.message || "Internal server error." }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();
    const body = await request.json().catch(() => ({}));
    const { ids, id } = body;
    const targetIds = ids || (id ? [id] : []);
    const { searchParams } = new URL(request.url);
    const queryId = searchParams.get("id");
    if (queryId) targetIds.push(queryId);

    if (targetIds.length === 0) {
      return NextResponse.json({ success: false, message: "No order IDs provided." }, { status: 400 });
    }

    await Order.deleteMany({ _id: { $in: targetIds } });
    return NextResponse.json({ success: true, message: "Orders deleted successfully." }, { status: 200 });
  } catch (error) {
    console.error("API Error deleting orders:", error);
    return NextResponse.json({ success: false, message: error.message || "Failed to delete orders." }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { ids, orderStatus } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ success: false, message: "No order IDs provided." }, { status: 400 });
    }

    if (!orderStatus) {
      return NextResponse.json({ success: false, message: "Order status is required." }, { status: 400 });
    }

    await Order.updateMany({ _id: { $in: ids } }, {$set: { orderStatus } });
    return NextResponse.json({ success: true, message: "Orders updated successfully." }, { status: 200 });
  } catch (error) {
    console.error("API Error bulk updating orders:", error);
    return NextResponse.json({ success: false, message: error.message || "Failed to update orders." }, { status: 500 });
  }
}