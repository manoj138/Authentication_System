# 🚀 SearchSelect Component Documentation

A reusable, professional, and high-performance **React SearchSelect** component built with Tailwind CSS and Lucide icons. It supports dynamic API searching, keyboard navigation, and automatic scrolling.

---

## 🛠️ Component Props

| Prop | Type | Description |
| :--- | :--- | :--- |
| `label` | `string` | Label text displayed above the input. |
| `name` | `string` | The `name` attribute for the input field. |
| `value` | `string` | The current text value showing in the input. |
| `onChange` | `function` | Triggers when the user types (updates search state). |
| `onSelect` | `function` | Triggers when an item is selected (returns the full object). |
| `apiEndpoint` | `string` | The API path to fetch data (e.g., `/customer`). |
| `displayKey` | `string` | The key in the object to show in the list (e.g., `customer_name`). |
| `placeholder`| `string` | Placeholder text for the input. |
| `icon` | `LucideIcon`| Optional Lucide icon to show on the left (default: `Search`). |

---

# 🚀 SearchSelect Component Documentation

A reusable, professional, and high-performance **React SearchSelect** component built with Tailwind CSS and Lucide icons. It supports dynamic API searching, keyboard navigation, and automatic scrolling.

---

## 🛠️ Component Props

| Prop | Type | Description |
| :--- | :--- | :--- |
| `label` | `string` | Label text displayed above the input. |
| `name` | `string` | The `name` attribute for the input field. |
| `value` | `string` | The current text value showing in the input. |
| `onChange` | `function` | Triggers when the user types (updates search state). |
| `onSelect` | `function` | Triggers when an item is selected (returns the full object). |
| `apiEndpoint` | `string` | The API path to fetch data (e.g., `/customer`). |
| `displayKey` | `string` | The key in the object to show in the list (e.g., `customer_name`). |
| `placeholder`| `string` | Placeholder text for the input. |
| `icon` | `LucideIcon`| Optional Lucide icon to show on the left (default: `Search`). |

---

# 🚀 Universal SearchSelect Component

A highly reusable, dynamic search-and-select component. It allows developers to search any database entity (Users, Products, Orders) via API and select a full data object.

---

## ⚙️ How to Use (Quick Start)

To use this component for any data type, follow this pattern:

```jsx
<SearchSelect
  label="Select [Entity Name]"
  apiEndpoint="/your-api-route" 
  displayKey="field_to_show_in_list"
  value={state.displayValue}
  onChange={(e) => setState({ ...state, displayValue: e.target.value })}
  onSelect={(item) => {
    if (item) {
 
      console.log("Selected Object:", item);
      
      setForm({ ...form, entity_id: item.id, entity_name: item.name });
    }
  }}
/>





## 💡 Implementation Examples

### 1. Simple Selection (e.g., Customer)
Use this for basic selection where you need the `id` and `name`.

// jsx
<SearchSelect
  label="Customer Name"
  name="customer_name"
  value={saleData.customer_name}
  apiEndpoint="/customer"
  displayKey="customer_name"
  placeholder="Search Customer..."
  onChange={(e) => setSaleData({ ...saleData, customer_name: e.target.value })}
  onSelect={(cust) => {
    if (cust) {
      setSaleData({ 
        ...saleData, 
        customer_id: cust.customer_id, 
        customer_name: cust.customer_name 
      });
    }
  }}
/>