document.addEventListener('DOMContentLoaded', async function() {
    await loadPriceList();
});

async function loadPriceList() {
    try {
        const response = await fetch('/api/PriceListModel');
        const data = await response.json();
        
        const sortedData = data.sort((a, b) => {
            const aIsTextOnly = /^[а-яА-Яa-zA-Z\s]+$/.test(a.title);
            const bIsTextOnly = /^[а-яА-Яa-zA-Z\s]+$/.test(b.title);
            
            if (aIsTextOnly && !bIsTextOnly) return -1;
            if (!aIsTextOnly && bIsTextOnly) return 1;
            return a.price - b.price;
        });

        const priceListContainer = document.querySelector('.priceList');
        let html = '';
        let lastWasTextOnly = null;

        sortedData.forEach((item, index) => {
            const isTextOnly = /^[а-яА-Яa-zA-Z\s]+$/.test(item.title);
            
            if (lastWasTextOnly === true && !isTextOnly) {
                html += '<div class="priceSeparator"></div>';
            }
            
            html += `
                <div class="priceItem">
                    <span class="priceTitle">${item.title}</span>
                    <span class="priceValue">${item.price === 0 ? 'бесплатно' : item.price + ' ₽'}</span>
                </div>
            `;
            
            lastWasTextOnly = isTextOnly;
        });

        html += `
            <span class="priceNote">
                Точная цена рассчитывается при оформлении заказа. Для уточнения стоимости, оставьте заявку или свяжитесь с нами напрямую.
            </span>
        `;

        priceListContainer.innerHTML = html;
    } catch (error) {
        console.error('Error loading price list:', error);
        showNotification('Ошибка при загрузке прайс-листа', 'error');
    }
}
