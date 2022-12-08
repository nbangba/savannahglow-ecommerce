

## 🚀 Quick start

1.  **A single product ecommerce website**.
Savannah glow is a responsive single product ecommerce website that sells a shea butter product with 
the potential to grow and sell more products.
It was built with [Gatsby](https://www.gatsbyjs.com/) (A react static site generator) but has dynamic component. It uses 
[Contentful](https://www.contentful.com/) as a headless CMS and data stored in firebase for the dynamic components.
[Styled-components](https://styled-components.com/) is used for the styling. 
[Google cloud functions](https://developers.google.com/learn/topics/functions) is used for hosting and executing serverless functions.
[React-pdf](https://react-pdf.org/) was used for creating the receipts.
 
2.  **Logic**
 It consists of a homepage, product, blog and faq page for non logged in users,
 additional profile, orders,settings page for logged in users and user orders and users page for admin.
 Users have the option to buy now or place items in a cart for later. They can then check out where they have the option to pay 
 with a credit card or pay on delivery. At the check out page user will need to provide an address 
 if one is not already in the system. On completeion of order status of order will be set to "received" and a mail will automatically be sent 
 to the email provided by the user with order details and status. User can cancel order at anytime if status of order has not changed from received 
 and if payment has already been made, a refund will be made by the pay service provider. Logged in users can always check the status of their order
 and download receipt on the orders page.
 
 On completion of an order it appears in the list of user orders of an admin. Admin has the option to dispatch received orders,and this changes
 the status of an order from received to dispatch and buyer automatically receives an email. 
 Dispatched items can be assigned to users who have been given the role of dispatchers. Once an item is delivered, admin or dispatcher can update order 
 status to delivered after which order is completed.
 
 Roles can be assigned to users on the user page by admin1 and admin2. Admin2 can also delete users on the users page.
 
 On the settings page, logged in users have the option of adding address, changing email and password,changing name and deleting account.
 Static components (products and blogs) of the page are created with data from Contentful CMS whiles the dynamic components are created by 
 querying data from firestore.
 
 Play around website to see how it works 😀 .
 
 
 
 
 

    

3.  **Open the code and start playing around 😀!**

   Site is running at https://www.savannahglow.com/!

4.  **Learn more**

    - [Gatsby](https://www.gatsbyjs.com/)

    - [Contentful](https://www.contentful.com/)

    - [Styled-components](https://styled-components.com/)

    - [Google cloud functions](https://developers.google.com/learn/topics/functions)

    - [React-pdf](https://react-pdf.org/)

