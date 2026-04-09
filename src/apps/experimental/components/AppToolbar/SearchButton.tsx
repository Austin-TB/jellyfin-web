import React, { type FC, useCallback, useEffect, useRef, useState } from 'react';
import {
    URLSearchParamsInit,
    createSearchParams,
    useLocation,
    useNavigate,
    useSearchParams
} from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import globalize from 'lib/globalize';

const getUrlParams = (searchParams: URLSearchParams) => {
    const parentId =
        searchParams.get('parentId') || searchParams.get('topParentId');
    const collectionType = searchParams.get('collectionType');
    const params: URLSearchParamsInit = {};

    if (parentId) {
        params.parentId = parentId;
    }

    if (collectionType) {
        params.collectionType = collectionType;
    }
    return params;
};

const SearchButton: FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isExpanded, setIsExpanded] = useState(false);
    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const isSearchPath = location.pathname === '/search';

    // Expand automatically when already on search page
    useEffect(() => {
        if (isSearchPath) {
            setIsExpanded(true);
            const q = searchParams.get('query') ?? '';
            setQuery(q);
        }
    }, [isSearchPath, searchParams]);

    const expand = useCallback(() => {
        setIsExpanded(true);
        setTimeout(() => inputRef.current?.focus(), 50);
    }, []);

    const collapse = useCallback(() => {
        if (query) return; // don't collapse while there's a query
        setIsExpanded(false);
    }, [query]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            const baseParams = getUrlParams(searchParams);
            const search = createSearchParams({ ...baseParams, ...(value ? { query: value } : {}) });
            navigate({ pathname: '/search', search: value ? `?${search}` : undefined }, { replace: isSearchPath });
        }, 300);
    }, [navigate, searchParams, isSearchPath]);

    const handleClear = useCallback(() => {
        setQuery('');
        setIsExpanded(false);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (isSearchPath) navigate(-1);
    }, [isSearchPath, navigate]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            handleClear();
        }
    }, [handleClear]);

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                borderRadius: '4px',
                transition: 'all 0.3s ease',
                ...(isExpanded ? {
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    paddingLeft: '0.5rem',
                    width: { xs: '200px', md: '260px' }
                } : {
                    width: '40px',
                    border: '1px solid transparent'
                })
            }}
        >
            {!isExpanded ? (
                <IconButton
                    size='large'
                    aria-label={globalize.translate('Search')}
                    color='inherit'
                    onClick={expand}
                    sx={{ padding: '8px' }}
                >
                    <SearchIcon />
                </IconButton>
            ) : (
                <>
                    <SearchIcon sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.2rem', flexShrink: 0 }} />
                    <InputBase
                        inputRef={inputRef}
                        value={query}
                        onChange={handleChange}
                        onBlur={collapse}
                        onKeyDown={handleKeyDown}
                        placeholder={globalize.translate('Search')}
                        autoComplete='off'
                        sx={{
                            color: '#fff',
                            fontSize: '0.9rem',
                            flex: 1,
                            ml: 0.75,
                            '& input': {
                                padding: '6px 0',
                                '&::placeholder': {
                                    color: 'rgba(255,255,255,0.5)',
                                    opacity: 1
                                }
                            }
                        }}
                        inputProps={{ 'aria-label': globalize.translate('Search'), maxLength: 40 }}
                    />
                    <IconButton
                        size='small'
                        aria-label='Clear search'
                        color='inherit'
                        onClick={handleClear}
                        sx={{ color: 'rgba(255,255,255,0.6)', padding: '4px' }}
                    >
                        <CloseIcon fontSize='small' />
                    </IconButton>
                </>
            )}
        </Box>
    );
};

export default SearchButton;
