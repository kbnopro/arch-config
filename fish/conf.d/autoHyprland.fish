if status --is-login
    if uwsm check may-start
        exec uwsm start hyprland.desktop >~/.cache/hyprland.log
    end
end
