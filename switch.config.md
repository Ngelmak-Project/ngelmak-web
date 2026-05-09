Great — your scan result tells us exactly what we needed to know.

You now have **two hosts** on your shared network:

- **10.42.0.1** → your Linux machine (the router)
- **10.42.0.130** → the headless server you plugged into the switch

That means your server **is alive**, has received a DHCP lease, and is reachable on the LAN.

Now the only remaining step is: **figure out what the server is running so you can get into it**.

Below are the most reliable ways to identify and access a headless machine when you only know its IP.

---

# 🎯 1. Try SSH (most servers run it)
On your Linux machine:

```
ssh 10.42.0.130
```

If you know the username, try it:

```
ssh user@10.42.0.130
```

If you don’t know the username, try common ones:

```
ssh root@10.42.0.130
ssh ubuntu@10.42.0.130
ssh debian@10.42.0.130
ssh admin@10.42.0.130
```

If SSH is running, you’ll get a fingerprint prompt.

---

# 🎯 2. Scan the server for open ports (to identify OS/services)
This is safe on your own network:

```
sudo nmap -sV 10.42.0.130
```

This will tell you:

- whether SSH is running  
- whether it’s Linux or Windows  
- whether it’s running a web server  
- what services are exposed  

Example output might show:

```
22/tcp open ssh
80/tcp open http
```

That gives you a clear entry point.

---

# 🎯 3. Check the server’s MAC address (to identify vendor)
Run:

```
arp -n 10.42.0.130
```

You’ll see something like:

```
10.42.0.130  xx:xx:xx:xx:xx:xx
```

Then look up the MAC prefix:

```
sudo nmap --script mac-geolocation 10.42.0.130
```

Or paste the MAC here and I’ll identify the manufacturer for you.

This often reveals whether it’s:

- Dell server  
- HP server  
- Raspberry Pi  
- Intel NUC  
- Virtual machine  

---

# 🎯 4. If it’s a Raspberry Pi or similar
Try:

```
ssh pi@10.42.0.130
```

Default password is often `raspberry`.

---

# 🎯 5. If it’s a Windows Server
Try:

```
nmap -p 3389 10.42.0.130
```

If port 3389 is open, it’s running RDP.

---

# 🎯 6. If it’s running a web interface
Try opening in a browser:

```
http://10.42.0.130
https://10.42.0.130
```

Many servers expose:

- Proxmox  
- TrueNAS  
- ESXi  
- IPMI / BMC  
- Webmin  
- Cockpit  
