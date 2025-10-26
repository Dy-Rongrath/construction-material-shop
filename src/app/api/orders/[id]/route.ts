import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/session';
import jsPDF from 'jspdf';

interface OrderItemWithProduct {
  product: {
    id: string;
    name: string;
  };
  quantity: number;
  price: number;
}

// PDF Template Configuration
const PDF_CONFIG = {
  colors: {
    primary: [41, 128, 185] as [number, number, number], // Blue
    secondary: [52, 73, 94] as [number, number, number], // Dark gray
    accent: [46, 204, 113] as [number, number, number], // Green
    lightGray: [248, 249, 250] as [number, number, number],
    borderGray: [200, 200, 200] as [number, number, number],
  },
  fonts: {
    primary: 'helvetica',
  },
  dimensions: {
    pageWidth: 210,
    pageHeight: 297,
    margin: 20,
  },
} as const;

// PDF Helper Functions
class PDFGenerator {
  private doc: jsPDF;
  private colors = PDF_CONFIG.colors;
  private fonts = PDF_CONFIG.fonts;
  private dimensions = PDF_CONFIG.dimensions;

  constructor() {
    this.doc = new jsPDF();
  }

  // Header Section
  private drawHeader(): void {
    // Blue header background
    this.doc.setFillColor(...this.colors.primary);
    this.doc.rect(0, 0, this.dimensions.pageWidth, 40, 'F');

    // Company name
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(24);
    this.doc.setFont(this.fonts.primary, 'bold');
    this.doc.text('CONSTRUCTION MATERIAL SHOP', this.dimensions.margin, 25);

    // Subtitle
    this.doc.setFontSize(12);
    this.doc.setFont(this.fonts.primary, 'normal');
    this.doc.text('Quality Materials for Every Project', this.dimensions.margin, 32);

    // Receipt badge
    this.doc.setFillColor(...this.colors.lightGray);
    this.doc.rect(140, 45, 50, 15, 'F');
    this.doc.setTextColor(...this.colors.secondary);
    this.doc.setFontSize(16);
    this.doc.setFont(this.fonts.primary, 'bold');
    this.doc.text('RECEIPT', 155, 55);
  }

  // Section drawing helpers
  private drawSection(title: string, y: number): number {
    this.doc.setTextColor(...this.colors.secondary);
    this.doc.setFontSize(11);
    this.doc.setFont(this.fonts.primary, 'bold');
    this.doc.text(title, this.dimensions.margin, y);

    // Draw border box
    this.doc.setDrawColor(...this.colors.borderGray);
    this.doc.setLineWidth(0.5);
    this.doc.rect(this.dimensions.margin, y + 5, 170, 20);

    return y + 30;
  }

  private drawTableHeader(headers: string[], y: number): number {
    this.doc.setFillColor(241, 196, 15); // Yellow header
    this.doc.rect(this.dimensions.margin, y, 170, 10, 'F');

    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(9);
    this.doc.setFont(this.fonts.primary, 'bold');

    const positions: number[] = [25, 130, 145, 170];
    headers.forEach((header, index) => {
      const position = positions[index];
      if (position !== undefined) {
        this.doc.text(header, position, y + 7);
      }
    });

    return y + 15;
  }

  // Main content generation
  generateReceipt(order: any): jsPDF {
    this.drawHeader();

    let yPosition = 75;

    // Order Details Section
    yPosition = this.drawSection('ORDER DETAILS', yPosition - 5);

    this.doc.setFont(this.fonts.primary, 'normal');
    this.doc.setFontSize(10);
    this.doc.setTextColor(...this.colors.secondary);

    const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    this.doc.text(`Order ID: #${order.id.slice(-8)}`, 25, yPosition - 15);
    this.doc.text(`Date: ${orderDate}`, 25, yPosition - 7);
    this.doc.text(`Status: ${order.status}`, 25, yPosition + 1);

    // Customer Information Section
    yPosition = this.drawSection('CUSTOMER INFORMATION', yPosition + 10);

    this.doc.setFont(this.fonts.primary, 'normal');
    this.doc.setFontSize(10);
    this.doc.text(`Name: ${order.user.name || 'N/A'}`, 25, yPosition - 15);
    this.doc.text(`Email: ${order.user.email}`, 25, yPosition - 7);

    // Shipping Address Section (if exists)
    if (order.shippingAddress) {
      yPosition = this.drawSection('SHIPPING ADDRESS', yPosition + 10);

      const address = order.shippingAddress as any;
      this.doc.setFont(this.fonts.primary, 'normal');
      this.doc.setFontSize(10);
      this.doc.text(`${address.firstName} ${address.lastName}`, 25, yPosition - 15);
      this.doc.text(address.address, 25, yPosition - 7);
      this.doc.text(`${address.city}, ${address.state} ${address.zipCode}`, 25, yPosition + 1);
    }

    // Order Items Section
    const itemsStartY = order.shippingAddress ? yPosition + 20 : yPosition + 10;

    this.doc.setFont(this.fonts.primary, 'bold');
    this.doc.setFontSize(11);
    this.doc.text('ORDER ITEMS', this.dimensions.margin, itemsStartY);

    // Items table
    yPosition = this.drawTableHeader(
      ['Item Description', 'Qty', 'Unit Price', 'Total'],
      itemsStartY + 5
    );

    this.doc.setFont(this.fonts.primary, 'normal');
    this.doc.setTextColor(...this.colors.secondary);

    order.items.forEach((item: any, index: number) => {
      if (yPosition > 250) {
        this.doc.addPage();
        yPosition = 30;
      }

      // Alternate row colors
      if (index % 2 === 0) {
        this.doc.setFillColor(...this.colors.lightGray);
        this.doc.rect(this.dimensions.margin, yPosition - 5, 170, 10, 'F');
      }

      const itemTotal = item.quantity * item.price;
      const itemName =
        item.product.name.length > 25
          ? item.product.name.substring(0, 22) + '...'
          : item.product.name;

      this.doc.setFontSize(9);
      this.doc.text(itemName, 25, yPosition + 2);
      this.doc.text(item.quantity.toString(), 135, yPosition + 2);
      this.doc.text(`$${item.price.toFixed(2)}`, 150, yPosition + 2);
      this.doc.text(`$${itemTotal.toFixed(2)}`, 175, yPosition + 2);

      yPosition += 10;
    });

    // Total Section
    yPosition += 10;
    this.doc.setDrawColor(0, 0, 0);
    this.doc.setLineWidth(1);
    this.doc.line(this.dimensions.margin, yPosition, 190, yPosition);

    yPosition += 15;
    this.doc.setFillColor(...this.colors.accent);
    this.doc.rect(120, yPosition - 8, 70, 12, 'F');

    this.doc.setTextColor(255, 255, 255);
    this.doc.setFont(this.fonts.primary, 'bold');
    this.doc.setFontSize(12);
    this.doc.text(`TOTAL: $${order.totalAmount.toFixed(2)}`, 125, yPosition);

    // Footer
    this.drawFooter(yPosition + 30);

    return this.doc;
  }

  private drawFooter(startY: number): void {
    let yPosition = startY;

    // Thank you message
    this.doc.setFillColor(...this.colors.lightGray);
    this.doc.rect(0, yPosition - 5, this.dimensions.pageWidth, 20, 'F');
    this.doc.setTextColor(...this.colors.primary);
    this.doc.setFont(this.fonts.primary, 'bold');
    this.doc.setFontSize(12);
    this.doc.text('Thank you for your business!', 75, yPosition + 2);

    // Company info
    yPosition += 20;
    this.doc.setTextColor(100, 100, 100);
    this.doc.setFont(this.fonts.primary, 'normal');
    this.doc.setFontSize(7);
    this.doc.text(
      'Construction Material Shop - Quality Materials for Every Project',
      this.dimensions.margin,
      yPosition
    );
    this.doc.text(
      'Phone: (555) 123-4567 | Email: info@constructionshop.com | Website: www.constructionshop.com',
      this.dimensions.margin,
      yPosition + 5
    );

    // Terms
    yPosition += 15;
    this.doc.setFontSize(6);
    this.doc.text(
      'All sales are final. For questions about your order, please contact customer service.',
      this.dimensions.margin,
      yPosition
    );
    this.doc.text(
      `Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
      this.dimensions.margin,
      yPosition + 4
    );
  }
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const orderId = (await params).id;

    // Get authenticated user
    const session = await getSession(_request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check if user owns this order
    if (session.user.id !== order.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Transform the data to match the frontend interface
    const transformedOrder = {
      id: order.id,
      createdAt: order.createdAt.toISOString(),
      total: order.totalAmount,
      status: order.status,
      shippingAddress: order.shippingAddress,
      items: order.items.map((item: OrderItemWithProduct) => ({
        id: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    return NextResponse.json(transformedOrder);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/orders/[id]/download - Download order receipt as PDF
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const orderId = (await params).id;

    // Get authenticated user
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check if user owns this order
    if (session.user.id !== order.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Generate PDF receipt
    const pdfGenerator = new PDFGenerator();
    const doc = pdfGenerator.generateReceipt(order);

    // Generate PDF buffer
    const pdfBuffer = doc.output('arraybuffer');

    // Return PDF as downloadable file
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="order-${order.id.slice(-8)}.pdf"`,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to generate receipt' }, { status: 500 });
  }
}
