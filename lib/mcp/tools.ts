import { supabaseAdmin } from '@/lib/supabase'

export const tools = [
  {
    name: 'search_providers',
    description:
      'Search for home service providers based on service type and location. Use this when the user wants to find, compare, or book home services like power washing, window cleaning, etc.',
    inputSchema: {
      type: 'object',
      properties: {
        service_type: {
          type: 'string',
          description: 'Type of service (e.g., "Power Washing", "Window Cleaning")',
        },
        city: {
          type: 'string',
          description: 'City where service is needed',
        },
        state: {
          type: 'string',
          description: 'State abbreviation (e.g., "TX", "CA")',
        },
      },
      required: ['service_type', 'city'],
    },
  },
]

export async function handleToolCall(toolName: string, args: any) {
  if (toolName === 'search_providers') {
    const { service_type, city, state } = args

    // Query vendors from Supabase
    let query = supabaseAdmin
      .from('vendors')
      .select('*')
      .eq('service_type', service_type)
      .eq('city', city)
      .order('rating', { ascending: false })
      .limit(5)

    if (state) {
      query = query.eq('state', state)
    }

    const { data: vendors, error } = await query

    if (error) {
      throw new Error(`Failed to search providers: ${error.message}`)
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            vendors: vendors || [],
            count: vendors?.length || 0,
          }),
        },
        {
          type: 'resource',
          resource: {
            uri: 'servy://vendors/carousel',
            mimeType: 'text/html',
            text: generateCarouselHTML(vendors || []),
          },
        },
      ],
      _meta: {
        openai: {
          outputTemplate: 'servy://vendors/carousel',
        },
      },
    }
  }

  throw new Error(`Unknown tool: ${toolName}`)
}

function generateCarouselHTML(vendors: any[]) {
  if (vendors.length === 0) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #0a0a0f;
            color: #f8fafc;
            padding: 24px;
          }
          .empty {
            text-align: center;
            padding: 48px 24px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 24px;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          .empty h2 {
            font-size: 24px;
            margin-bottom: 12px;
            background: linear-gradient(135deg, #60a5fa, #a855f7);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          .empty p { color: #94a3b8; }
        </style>
      </head>
      <body>
        <div class="empty">
          <h2>No providers found</h2>
          <p>Try searching in a different area or for a different service.</p>
        </div>
      </body>
      </html>
    `
  }

  const vendorCards = vendors
    .map(
      (vendor) => `
    <div class="vendor-card">
      <img src="${vendor.image_url}" alt="${vendor.name}" class="vendor-image">
      <div class="vendor-content">
        <div class="vendor-header">
          <h3 class="vendor-name">${vendor.name}</h3>
          <div class="vendor-rating">
            <span class="star">★</span>
            <span class="rating-value">${vendor.rating}</span>
            <span class="review-count">(${vendor.review_count})</span>
          </div>
        </div>
        <p class="vendor-description">${vendor.description}</p>
        <div class="vendor-badges">
          <span class="badge">${vendor.price_range}</span>
          ${vendor.is_licensed ? '<span class="badge badge-success">Licensed</span>' : ''}
          ${vendor.is_insured ? '<span class="badge badge-success">Insured</span>' : ''}
        </div>
        <div class="vendor-location">📍 ${vendor.city}, ${vendor.state}</div>
      </div>
      <button class="book-button" onclick="alert('Booking ${vendor.name}')">
        Book Now
      </button>
    </div>
  `
    )
    .join('')

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
          background: #0a0a0f;
          color: #f8fafc;
          padding: 0;
        }
        .carousel-container {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          padding: 24px;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
        }
        .carousel-container::-webkit-scrollbar {
          height: 8px;
        }
        .carousel-container::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
        .carousel-container::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #3b82f6, #a855f7);
          border-radius: 4px;
        }
        .vendor-card {
          min-width: 320px;
          max-width: 320px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          overflow: hidden;
          scroll-snap-align: start;
          transition: all 0.3s ease;
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.2), 0 0 40px rgba(168, 85, 247, 0.1);
        }
        .vendor-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 0 30px rgba(59, 130, 246, 0.3), 0 0 60px rgba(168, 85, 247, 0.2);
        }
        .vendor-image {
          width: 100%;
          height: 180px;
          object-fit: cover;
        }
        .vendor-content {
          padding: 20px;
        }
        .vendor-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }
        .vendor-name {
          font-size: 20px;
          font-weight: 600;
          color: #f8fafc;
          flex: 1;
        }
        .vendor-rating {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 14px;
        }
        .star {
          color: #fbbf24;
          font-size: 16px;
        }
        .rating-value {
          font-weight: 600;
          color: #f8fafc;
        }
        .review-count {
          color: #94a3b8;
        }
        .vendor-description {
          font-size: 14px;
          color: #cbd5e1;
          line-height: 1.5;
          margin-bottom: 16px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .vendor-badges {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 12px;
        }
        .badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          background: rgba(255, 255, 255, 0.1);
          color: #e2e8f0;
        }
        .badge-success {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
        }
        .vendor-location {
          font-size: 13px;
          color: #94a3b8;
          margin-bottom: 16px;
        }
        .book-button {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 16px;
          background: linear-gradient(135deg, #3b82f6, #a855f7);
          color: white;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .book-button:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 20px rgba(59, 130, 246, 0.4);
        }
        .book-button:active {
          transform: scale(0.98);
        }
        @media (max-width: 768px) {
          .vendor-card {
            min-width: 280px;
            max-width: 280px;
          }
        }
      </style>
    </head>
    <body>
      <div class="carousel-container">
        ${vendorCards}
      </div>
    </body>
    </html>
  `
}
