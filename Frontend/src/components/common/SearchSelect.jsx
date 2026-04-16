import React, { useState, useEffect, useRef, useCallback } from "react";
import { Api } from "./Api/api";
import Input from "./Input";
import { Search, X, Loader2, ChevronDown } from "lucide-react";

const SearchSelect = ({ 
  label, 
  name, 
  value, 
  onChange, 
  onSelect, 
  apiEndpoint, 
  displayKey, 
  placeholder, 
  icon = Search,
  error 
}) => {
  const [list, setList] = useState([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const listRef = useRef(null); 
  const abortControllerRef = useRef(null);

  // बाहेरील क्लिक डिटेक्ट करून ड्रॉपडाउन बंद करणे
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShow(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // कीबोर्ड नेव्हिगेशन करताना सिलेक्टेड आयटमवर आपोआप स्क्रोल करणे
  useEffect(() => {
    if (activeIndex !== -1 && listRef.current) {
      const activeElement = listRef.current.children[activeIndex];
      if (activeElement) {
        activeElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth"
        });
      }
    }
  }, [activeIndex]);

  // मुख्य डेटा फेचिंग फंक्शन
  const fetchData = useCallback(async (searchTerm = "") => {
    // मागील पेंडिंग रिक्वेस्ट कॅन्सल करणे
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    setLoading(true);
    try {
      // जर सर्च टर्म नसेल तर फक्त मूळ पॅथवर कॉल जाईल (ज्याने टॉप १० रेकॉर्ड्स मिळतील)
      const query = searchTerm ? `?search=${searchTerm}` : "";
      const res = await Api.get(`${apiEndpoint}${query}`, {
        signal: abortControllerRef.current.signal,
      });
      
      setList(res.data.data || []);
      setShow(true);
      setActiveIndex(-1); 
    } catch (err) {
      if (err.name !== "CanceledError") console.error("Search Error:", err);
    } finally {
      setLoading(false);
    }
  }, [apiEndpoint]);

  // डिबाऊन्सिंग इफेक्ट: युजरने टाईप केल्यावर थोड्या वेळाने सर्च होण्यासाठी
  useEffect(() => {
    const timer = setTimeout(() => {
      if (show) {
        fetchData(value);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [value, fetchData, show]);

  // कीबोर्ड इव्हेंट्स (बाण आणि एंटर)
  const handleKeyDown = (e) => {
    if (!show || list.length === 0) return;
    
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(prev => (prev < list.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0) {
        handlePick(list[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setShow(false);
    }
  };

  // आयटम सिलेक्ट केल्यावर काय व्हावे
  const handlePick = (item) => {
    onSelect(item);
    setShow(false);
    setList([]);
    setActiveIndex(-1);
  };

  return (
    <div className="relative w-full" ref={dropdownRef} onKeyDown={handleKeyDown}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-left">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        <Input
          name={name}
          value={value}
          placeholder={placeholder}
          icon={icon}
          className="w-full pr-16 transition-all duration-200" 
          onChange={(e) => {
            onChange(e);
            setShow(true);
            setActiveIndex(-1);
          }}
          autoComplete="off"
          // ✅ इनपुटवर क्लिक केल्यावर थेट टॉप १० रेकॉर्ड्स दिसतील
          onFocus={() => {
            setShow(true);
            fetchData(value); 
          }}
        />
        
        {/* स्टेटस आयकॉन्स (Loading, Clear, Chevron) */}
        <div className="absolute right-4 flex items-center gap-2 pointer-events-none">
          {loading ? (
            <Loader2 size={16} className="animate-spin text-blue-500" />
          ) : (
            <div className="flex items-center gap-1 pointer-events-auto">
              {value && (
                <button
                  type="button"
                  onClick={() => {
                    onChange({ target: { name, value: "" } });
                    onSelect(null);
                    setList([]);
                    setShow(false);
                  }}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X size={14} strokeWidth={3} />
                </button>
              )}
              <ChevronDown 
                size={14} 
                className={`text-gray-400 transition-transform ${show ? 'rotate-180' : ''}`} 
                strokeWidth={3}
              />
            </div>
          )}
        </div>
      </div>

      {/* ड्रॉपडाउन लिस्ट */}
      {show && (
        <div className="absolute left-0 right-0 z-[9999] bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-2xl mt-1 overflow-hidden">
          <div 
            className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300" 
            ref={listRef}
          >
            {list.length > 0 ? (
              list.map((item, index) => (
                <div
                  key={index}
                  className={`px-4 py-3 cursor-pointer transition-all border-b last:border-none text-sm font-semibold
                    ${activeIndex === index 
                      ? "bg-blue-600 text-white" 
                      : "hover:bg-blue-50 text-gray-700 dark:text-gray-200"
                    }
                  `}
                  onClick={() => handlePick(item)}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  {item[displayKey]}
                </div>
              ))
            ) : !loading && (
              <div className="p-4 text-center text-xs text-gray-400 font-medium italic">
                {value ? `No match for "${value}"` : "No records found"}
              </div>
            )}
          </div>
        </div>
      )}
      
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default SearchSelect;