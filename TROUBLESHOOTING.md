# Troubleshooting Guide

This guide helps you resolve common issues with the Germany Prep Hub application.

## 🔧 Common Issues

### 1. Hydration Errors

**Symptoms:**
- Error message: "Hydration failed because the server rendered HTML didn't match the client"
- Different values showing on server vs client (e.g., currency amounts)
- Console errors about mismatched HTML

**Causes:**
- Currency conversion happening during server-side rendering
- Date formatting differences between server and client
- Browser-specific localStorage access during SSR

**Solutions:**
- ✅ Use `ClientCurrency` component for all currency displays
- ✅ Use `useIsClient` hook for client-only operations
- ✅ Wrap dynamic content in client-only components

**Example Fix:**
```tsx
// ❌ Bad - causes hydration mismatch
<span>{formatCurrency(amount, currency)}</span>

// ✅ Good - prevents hydration mismatch
<ClientCurrency amount={amount} currency={currency} />
```

### 2. LocalStorage Errors

**Symptoms:**
- "localStorage is not defined" error
- Data not persisting between sessions
- Settings not loading properly

**Causes:**
- Accessing localStorage during server-side rendering
- Browser storage disabled or full
- Incognito mode restrictions

**Solutions:**
- ✅ Always check if `typeof window !== 'undefined'` before accessing localStorage
- ✅ Use try-catch blocks around localStorage operations
- ✅ Provide fallback values for when localStorage fails

**Example Fix:**
```tsx
// ✅ Safe localStorage access
const [data, setData] = useLocalStorage('key', defaultValue)
```

### 3. Currency Conversion Issues

**Symptoms:**
- Wrong currency amounts displayed
- Conversion not working
- NaN or undefined values

**Causes:**
- Invalid exchange rates (zero or undefined)
- Non-numeric input values
- Division by zero errors

**Solutions:**
- ✅ Validate exchange rates before conversion
- ✅ Handle edge cases (NaN, null, undefined)
- ✅ Provide fallback values

### 4. Build Errors

**Symptoms:**
- TypeScript compilation errors
- ESLint errors preventing build
- Missing dependencies

**Solutions:**
- ✅ Run `npm run build` to check for errors
- ✅ Fix TypeScript type errors
- ✅ Update dependencies if needed

### 5. Performance Issues

**Symptoms:**
- Slow page loading
- Laggy interactions
- High memory usage

**Solutions:**
- ✅ Use React.memo for expensive components
- ✅ Implement proper key props for lists
- ✅ Optimize re-renders with useCallback/useMemo

## 🛠️ Development Tools

### Debugging Hydration Issues

1. **Enable React Strict Mode** (already enabled in development)
2. **Check Browser Console** for hydration warnings
3. **Use React DevTools** to inspect component state
4. **Compare SSR vs Client HTML** in browser dev tools

### Testing Fixes

1. **Development Testing:**
   ```bash
   npm run dev
   # Check console for errors
   ```

2. **Production Testing:**
   ```bash
   npm run build
   npm start
   # Test in production mode
   ```

3. **Clean Cache:**
   ```bash
   # Clear Next.js cache
   rm -rf .next
   npm run build
   ```

## 🔍 Specific Error Messages

### "Hydration failed because the server rendered HTML didn't match the client"

**Quick Fix:**
1. Identify the component causing the mismatch
2. Wrap dynamic content in `ClientCurrency` or similar client-only components
3. Use `useIsClient` hook for conditional rendering

### "localStorage is not defined"

**Quick Fix:**
1. Check if code is running on client: `typeof window !== 'undefined'`
2. Use the provided `useLocalStorage` hook
3. Always provide fallback values

### "Cannot read property of undefined"

**Quick Fix:**
1. Add null checks: `data?.property`
2. Provide default values: `data || defaultValue`
3. Use optional chaining and nullish coalescing

## 📋 Checklist for New Features

When adding new features, ensure:

- [ ] No localStorage access during SSR
- [ ] Currency formatting uses `ClientCurrency` component
- [ ] Date formatting handles invalid dates
- [ ] Forms have proper validation
- [ ] Error boundaries catch exceptions
- [ ] TypeScript types are correct
- [ ] Build passes without errors

## 🆘 Getting Help

If you're still experiencing issues:

1. **Check the Browser Console** for detailed error messages
2. **Review Recent Changes** that might have introduced the issue
3. **Test in Incognito Mode** to rule out browser extensions
4. **Clear Browser Cache** and localStorage
5. **Try Different Browsers** to isolate browser-specific issues

## 📝 Reporting Issues

When reporting issues, include:

- **Error message** (full stack trace if available)
- **Steps to reproduce** the issue
- **Browser and version** being used
- **Operating system**
- **Console logs** (if relevant)

## 🔄 Recovery Steps

If the application is completely broken:

1. **Clear all data:**
   ```javascript
   // In browser console
   localStorage.clear()
   location.reload()
   ```

2. **Reset to defaults:**
   - Go to Settings page
   - Click "Clear All Data"
   - Refresh the page

3. **Reinstall dependencies:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run dev
   ```

Remember: The application is designed to be resilient and should recover gracefully from most errors! 